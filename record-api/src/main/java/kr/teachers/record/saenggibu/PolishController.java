package kr.teachers.record.saenggibu;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saenggibu")
public class PolishController {

    private final PolishService polishService;

    public PolishController(PolishService polishService) {
        this.polishService = polishService;
    }

    @PostMapping("/polish")
    public PolishResponse polish(@Valid @RequestBody PolishRequest request) {
        return polishService.polish(request);
    }
}
