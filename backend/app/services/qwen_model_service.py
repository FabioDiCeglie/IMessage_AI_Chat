from transformers import AutoModelForCausalLM, AutoTokenizer

from app.services.model_service import ModelService


class QwenModelService(ModelService):
    THINK_END_TOKEN_ID = 151668

    def __init__(self, model_name: str = "Qwen/Qwen3-0.6B"):
        super().__init__(model_name)
        self._tokenizer: AutoTokenizer | None = None
        self._model: AutoModelForCausalLM | None = None

    @property
    def is_loaded(self) -> bool:
        return self._model is not None and self._tokenizer is not None

    def load(self):
        self._tokenizer = AutoTokenizer.from_pretrained(self._model_name)
        self._model = AutoModelForCausalLM.from_pretrained(
            self._model_name,
            torch_dtype="auto",
            device_map="auto",
        )
        # We're only using the model, not training it
        self._model.eval()

    def generate(
        self,
        messages: list[dict],
        enable_thinking: bool = False,
        temperature: float = 0.7,
    ) -> dict:
        text = self._tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=enable_thinking,
        )

        model_inputs = self._tokenizer(text, return_tensors="pt").to(self._model.device)

        generated_ids = self._model.generate(
            **model_inputs,
            max_new_tokens=32768,
            temperature=temperature,
            # temperature=0 → same answer every time; temperature>0 → more creative/varied answers
            do_sample=temperature > 0,
        )

        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):].tolist()

        # Parse thinking content by finding the </think> token
        thinking = None
        try:
            index = len(output_ids) - output_ids[::-1].index(self.THINK_END_TOKEN_ID)
        except ValueError:
            index = 0

        if index > 0:
            raw_thinking = self._tokenizer.decode(output_ids[:index], skip_special_tokens=True)
            thinking = raw_thinking.replace("<think>", "").replace("</think>", "").strip()
        content = self._tokenizer.decode(output_ids[index:], skip_special_tokens=True).strip()

        return {
            "content": content,
            "thinking": thinking,
            "model": self._model_name,
        }
