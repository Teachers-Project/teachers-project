package kr.teachers.record.saenggibu;

import java.util.List;

public class StudentInfoDetectedException extends RuntimeException {
    private final List<String> reasons;

    public StudentInfoDetectedException(List<String> reasons) {
        super("학생 식별 정보가 감지되어 다듬기를 보내지 않았습니다.");
        this.reasons = List.copyOf(reasons);
    }

    public List<String> getReasons() {
        return reasons;
    }
}
