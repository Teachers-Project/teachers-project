package kr.teachers.record.saenggibu;

/**
 * NEIS 바이트 규칙: 한글 1자 3바이트, 영문·숫자·기호 1바이트, 줄바꿈 1바이트.
 * (2026 학교생활기록부 기재요령 글자수 표 기준)
 */
public final class NeisBytes {

    private NeisBytes() {
    }

    public static int count(String text) {
        int bytes = 0;
        for (int i = 0; i < text.length(); ) {
            int cp = text.codePointAt(i);
            i += Character.charCount(cp);
            if (cp == '\n') {
                bytes += 1;
            } else if (isHangul(cp)) {
                bytes += 3;
            } else {
                bytes += String.valueOf(Character.toChars(cp)).getBytes(java.nio.charset.StandardCharsets.UTF_8).length;
            }
        }
        return bytes;
    }

    private static boolean isHangul(int cp) {
        return (cp >= 0x1100 && cp <= 0x11FF)
                || (cp >= 0x3130 && cp <= 0x318F)
                || (cp >= 0xAC00 && cp <= 0xD7AF);
    }
}
