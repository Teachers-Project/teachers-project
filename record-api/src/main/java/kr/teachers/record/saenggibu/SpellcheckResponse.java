package kr.teachers.record.saenggibu;

import java.util.List;

/** 맞춤법 검사 결과. 문장을 고쳐 돌려주지 않고, 고칠 곳만 목록으로 알려 줍니다. */
public record SpellcheckResponse(List<Issue> issues) {

    /** original: 본문에 실제로 있는 부분, suggestion: 제안, reason: 짧은 이유 */
    public record Issue(String original, String suggestion, String reason) {
    }
}
