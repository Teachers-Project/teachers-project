package kr.teachers.record.saenggibu;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PolishServiceTest {

    @Test
    void 원문에_없는_합격이_추가되면_수정본을_막는다() {
        // 실제로 발생한 사례: "자격증을 취득함" → "시험에 합격하여 자격증을 취득함"
        AiClient ai = (system, text) -> "한국사능력검정시험에 합격하여 자격증을 취득함";
        PolishService service = new PolishService(ai);

        AddedContentException e = assertThrows(AddedContentException.class,
                () -> service.polish(new PolishRequest("한국사능력검정 자격증을 취득함", "certificate")));
        assertTrue(e.getReasons().stream().anyMatch(r -> r.contains("합격")));
    }

    @Test
    void 원문에_없는_숫자가_추가되면_수정본을_막는다() {
        AiClient ai = (system, text) -> "독서를 꾸준히 하여 연 12권 이상 읽음";
        PolishService service = new PolishService(ai);

        AddedContentException e = assertThrows(AddedContentException.class,
                () -> service.polish(new PolishRequest("독서를 꾸준히 하여 책을 많이 읽음", "reading")));
        assertTrue(e.getReasons().stream().anyMatch(r -> r.contains("12")));
    }

    @Test
    void 원문과_같은_사실만_다듬으면_통과한다() {
        AiClient ai = (system, text) -> "수업 시간에 탐구 활동을 주도적으로 수행함";
        PolishService service = new PolishService(ai);

        PolishResponse response = service.polish(
                new PolishRequest("수업 시간에 탐구 활동을 주도적으로 함", "subjectNote"));
        assertEquals("수업 시간에 탐구 활동을 주도적으로 수행함", response.revised());
    }

    @Test
    void 원문에_이미_있는_결과_단어는_막지_않는다() {
        AiClient ai = (system, text) -> "교내 대회에서 입상하여 성과를 보임";
        PolishService service = new PolishService(ai);

        // 원문에 '대회'와 '입상'이 있으므로 막히지 않아야 한다.
        PolishResponse response = service.polish(
                new PolishRequest("교내 대회에서 입상하여 성과를 보임", "award"));
        assertEquals("교내 대회에서 입상하여 성과를 보임", response.revised());
    }

    @Test
    void 원문에_없는_우수가_추가되면_막는다() {
        AiClient ai = (system, text) -> "교내 대회에서 입상하여 우수한 성과를 보임";
        PolishService service = new PolishService(ai);

        assertThrows(AddedContentException.class,
                () -> service.polish(new PolishRequest("교내 대회에서 입상하여 성과를 보임", "award")));
    }
}
