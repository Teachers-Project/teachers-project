package kr.teachers.record.saenggibu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PolishRequest(
        @NotBlank(message = "다듬을 문장을 입력하세요.")
        @Size(max = 1000, message = "문장이 너무 깁니다.")
        String text,

        @NotBlank(message = "영역을 선택하세요.")
        String field) {
}
