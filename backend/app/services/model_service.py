from abc import ABC, abstractmethod


class ModelService(ABC):
    def __init__(self, model_name: str):
        self._model_name = model_name

    @property
    @abstractmethod
    def is_loaded(self) -> bool:
        ...

    @abstractmethod
    def load(self):
        ...

    @abstractmethod
    def generate(
        self,
        messages: list[dict],
        enable_thinking: bool = False,
        temperature: float = 0.7,
    ) -> dict:
        ...
