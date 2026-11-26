package kr.teachers.record.saenggibu;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saenggibu")
public class SpellcheckController {

    private final SpellcheckService spellcheckService;

    public SpellcheckController(SpellcheckService spellcheckService) {
        this.spellcheckService = spellcheckService;
    }

    @PostMapping("/spellcheck")
    public SpellcheckResponse spellcheck(@Valid @RequestBody SpellcheckRequest request) {
        return spellcheckService.check(request);
    }
}
