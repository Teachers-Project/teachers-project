package kr.teachers.record.saenggibu;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class SpellcheckServiceTest {

    private static SpellcheckService with(String aiAnswer) {
        return new SpellcheckService((system, text) -> aiAnswer);
    }

    @Test
    void 오류_목록을_그대로_돌려준다() {
        SpellcheckService s = with("[{\"original\":\"되요\",\"suggestion\":\"돼요\",\"reason\":\"활용형\"}]");
        SpellcheckResponse r = s.check(new SpellcheckRequest("발표를 잘 하면 되요", "behavior"));
        assertEquals(1, r.issues().size());
        assertEquals("돼요", r.issues().get(0).suggestion());
    }

    @Test
    void 본문에_없는_구간은_버린다() {
        SpellcheckService s = with("[{\"original\":\"없는말\",\"suggestion\":\"있는말\",\"reason\":\"x\"}]");
        assertTrue(s.check(new SpellcheckRequest("발표를 잘 함", "behavior")).issues().isEmpty());
    }

    @Test
    void 제안에_사실이_더해지면_버린다() {
        SpellcheckService s = with("[{\"original\":\"자격증을\",\"suggestion\":\"시험 합격 자격증을\",\"reason\":\"x\"},"
                + "{\"original\":\"함\",\"suggestion\":\"12번 함\",\"reason\":\"x\"}]");
        assertTrue(s.check(new SpellcheckRequest("자격증을 취득함", "certificate")).issues().isEmpty());
    }

    @Test
    void 코드블록으로_감싼_응답도_읽는다() {
        SpellcheckService s = with("```json\n[]\n```");
        assertTrue(s.check(new SpellcheckRequest("문제없는 문장임", "behavior")).issues().isEmpty());
    }

    @Test
    void 읽을_수_없는_응답은_503_예외() {
        SpellcheckService s = with("오류가 없습니다");
        assertThrows(AiUnavailableException.class,
                () -> s.check(new SpellcheckRequest("문장임", "behavior")));
    }

    @Test
    void 허용되지_않은_영역은_거부한다() {
        SpellcheckService s = with("[]");
        assertThrows(IllegalArgumentException.class,
                () -> s.check(new SpellcheckRequest("문장임", "unknown")));
    }
}
