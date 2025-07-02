package cc5002.tarea4.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TemaEnum {
    música("Música"),
    deporte("Deporte"),
    ciencias("Ciencias"),
    religión("Religión"),
    política("Política"),
    tecnología("Tecnología"),
    juegos("Juegos"),
    baile("Baile"),
    comida("Comida"),
    otro("Otro");

    private final String value;

    TemaEnum(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}