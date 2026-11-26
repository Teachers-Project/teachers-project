package kr.teachers.record.saenggibu;

/** 외부 AI 호출 경계. 구현체는 설정이 있을 때만 활성화됩니다. */
public interface AiClient {

    /**
     * 교사가 쓴 문장을 다듬어 반환합니다. 학생 식별 정보가 없는 문장만 전달해야 합니다.
     *
     * @throws AiUnavailableException 설정이 없거나 호출에 실패했을 때
     */
    String polish(String systemPrompt, String userText);
}
