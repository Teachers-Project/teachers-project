package kr.teachers.record.saenggibu;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class PolishService {

    /** 프론트 limits.js 의 영역 키와 같아야 합니다. 허용되지 않은 영역은 거부합니다. */
    static final Set<String> ALLOWED_FIELDS = Set.of(
            "personalTalent", "attendanceNote", "award", "awardTarget", "certificate",
            "autonomy", "club", "career", "volunteer", "dailyLife", "freeCareer", "freeTopic",
            "freeArtsPE", "freeClub", "subjectNote", "individualNote", "readingCommon",
            "reading", "behavior");

    static final String SYSTEM_PROMPT = """
            너는 교사가 직접 쓴 학교생활기록부 문장의 어휘와 어미만 다듬는 도우미다.
            규칙:
            1. 원문에 없는 단어를 사실로 추가하지 않는다. 특히 합격, 수상, 선정, 취득, 참여, 대회,
               시험, 등급, 대표, 달성 같은 결과·실적 단어와 숫자를 새로 넣지 않는다.
            2. 원문의 주어, 대상, 활동, 결과, 수치를 바꾸거나 빼지 않는다.
            3. 원문에 없는 평가나 감정 표현을 덧붙이지 않는다. 어미, 어순, 중복 표현만 정리한다.
            4. 원문이 이미 자연스러우면 원문을 그대로 출력한다.
            5. 학생 이름, 학교명, 학번 등 식별 정보를 만들어 넣지 않는다.
               특정 대학교명, 교외 대회 수상, 상표명을 넣지 않는다.
            6. 다듬은 문장 한 개만 출력한다. 설명, 따옴표, 머리말은 쓰지 않는다.
            """;

    private final AiClient aiClient;

    public PolishService(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    public PolishResponse polish(PolishRequest request) {
        if (!ALLOWED_FIELDS.contains(request.field())) {
            throw new IllegalArgumentException("허용되지 않은 영역입니다: " + request.field());
        }
        List<String> found = StudentInfoGuard.findStudentInfo(request.text());
        if (!found.isEmpty()) {
            throw new StudentInfoDetectedException(found);
        }
        String revised = aiClient.polish(SYSTEM_PROMPT, request.text()).trim();

        // 모델이 지침을 어기고 사실을 더했는지 서버에서 한 번 더 확인한다.
        List<String> added = findAddedFacts(request.text(), revised);
        if (!added.isEmpty()) {
            throw new AddedContentException(added);
        }
        return new PolishResponse(revised);
    }

    /** 원문에 없던 결과 단어와 숫자가 수정본에 생겼는지 찾는다. */
    static List<String> findAddedFacts(String original, String revised) {
        List<String> added = new ArrayList<>();
        for (String term : RISKY_TERMS) {
            if (revised.contains(term) && !original.contains(term)) {
                added.add("원문에 없는 단어: " + term);
            }
        }
        Matcher numbers = Pattern.compile("\\d+").matcher(revised);
        while (numbers.find()) {
            String number = numbers.group();
            if (!original.contains(number)) {
                added.add("원문에 없는 숫자: " + number);
            }
        }
        return added;
    }

    /** AI가 임의로 넣기 쉬운 결과·실적 단어. 원문에 없으면 수정본에서 막는다. */
    static final List<String> RISKY_TERMS = List.of(
            "합격", "수상", "입상", "선정", "우수", "최우수", "금상", "은상", "동상", "장려상",
            "대표", "회장", "부장", "참가", "참여", "취득", "획득", "달성", "수료", "이수",
            "대회", "시험", "등급", "상위", "전국", "교외", "해외");
}
