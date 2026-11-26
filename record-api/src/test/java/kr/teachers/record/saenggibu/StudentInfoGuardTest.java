package kr.teachers.record.saenggibu;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class StudentInfoGuardTest {

    @Test
    void 이름_학생_형태는_감지한다() {
        assertTrue(!StudentInfoGuard.findStudentInfo("영희 학생이 발표를 주도함.").isEmpty());
    }

    @Test
    void 다른_학생같은_일반_표현은_통과한다() {
        assertEquals(0, StudentInfoGuard.findStudentInfo("다른 학생의 의견을 경청하며 모둠 활동을 이끎.").size());
    }

    @Test
    void 학번과_주민번호와_전화번호를_감지한다() {
        assertTrue(!StudentInfoGuard.findStudentInfo("20101 학번 학생이 발표함").isEmpty());
        assertTrue(!StudentInfoGuard.findStudentInfo("번호 900101-1234567 기재").isEmpty());
        assertTrue(!StudentInfoGuard.findStudentInfo("연락처 010-1234-5678").isEmpty());
    }

    @Test
    void 학교명은_감지하고_중학교_생활은_통과한다() {
        assertTrue(!StudentInfoGuard.findStudentInfo("서울초등학교에서 전학 온 후 잘 적응함.").isEmpty());
        assertEquals(0, StudentInfoGuard.findStudentInfo("우리 중학교 생활에 적응하며 성실하게 참여함.").size());
    }
}
