package kr.teachers.record.saenggibu;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class NeisBytesTest {

    @Test
    void 한글은_3바이트_영문숫자는_1바이트() {
        assertEquals(3, NeisBytes.count("가"));
        assertEquals(1, NeisBytes.count("A"));
        assertEquals(5, NeisBytes.count("가A1"));
    }

    @Test
    void 줄바꿈은_1바이트() {
        assertEquals(7, NeisBytes.count("가\n나"));
    }
}
