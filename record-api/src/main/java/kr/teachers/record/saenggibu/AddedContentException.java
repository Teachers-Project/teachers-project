package kr.teachers.record.saenggibu;

import java.util.List;

/**
 * AI가 원문에 없는 사실(결과 단어나 숫자)을 넣었을 때 던지는 예외.
 * 수정본을 화면에 보내지 않고, 어떤 단어가 추가됐는지 알려 줍니다.
 */
public class AddedContentException extends RuntimeException {

    private final List<String> reasons;

    public AddedContentException(List<String> reasons) {
        super("원문에 없는 내용이 추가되어 수정본을 보여 주지 않았습니다. 원문을 직접 다듬어 주세요.");
        this.reasons = List.copyOf(reasons);
    }

    public List<String> getReasons() {
        return reasons;
    }
}
