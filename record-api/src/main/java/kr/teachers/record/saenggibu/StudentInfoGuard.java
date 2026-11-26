package kr.teachers.record.saenggibu;

import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 서버 쪽 학생 식별 정보 검사. 프론트 checks.js 와 같은 규칙을 유지해야 합니다.
 * 이 검사를 통과하지 못하면 AI 로 아무것도 보내지 않습니다.
 */
public final class StudentInfoGuard {

    private static final Set<String> NOT_A_NAME = Set.of(
            "다른", "모든", "각각", "같은", "여러", "주변", "동료", "친구", "반", "우리", "일부",
            "다양한", "해당", "다수", "소수", "어려운", "이", "그", "저", "한", "두", "세");

    private static final Pattern STUDENT_ID = Pattern.compile("\\d{4,6}\\s*번?\\s*학생|학번\\s*[:：]?\\s*\\d+");
    private static final Pattern NAME_STUDENT = Pattern.compile("([가-힣]{2,4})\\s*학생");
    private static final Pattern SCHOOL_NAME = Pattern.compile("[가-힣]{2,}(초등학교|중학교|고등학교)");
    private static final Pattern RRN = Pattern.compile("\\d{6}-?[1-4]\\d{6}");
    private static final Pattern PHONE = Pattern.compile("\\d{3}-\\d{4}-\\d{4}");

    private StudentInfoGuard() {
    }

    /** 감지된 항목 설명 목록. 비어 있으면 통과입니다. */
    public static List<String> findStudentInfo(String text) {
        java.util.ArrayList<String> found = new java.util.ArrayList<>();
        if (STUDENT_ID.matcher(text).find()) {
            found.add("학번으로 보이는 숫자가 있습니다.");
        }
        Matcher m = NAME_STUDENT.matcher(text);
        while (m.find()) {
            if (!NOT_A_NAME.contains(m.group(1))) {
                found.add("'○○ 학생' 형태의 이름이 있을 수 있습니다.");
                break;
            }
        }
        if (SCHOOL_NAME.matcher(text).find()) {
            found.add("학교명으로 보이는 표현이 있습니다.");
        }
        if (RRN.matcher(text).find()) {
            found.add("주민등록번호 형식이 있습니다.");
        }
        if (PHONE.matcher(text).find()) {
            found.add("전화번호 형식이 있습니다.");
        }
        return found;
    }
}
