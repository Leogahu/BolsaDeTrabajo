package com.bolsaempleo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping(value = {
        "/{path:^(?!api|uploads|ws|api-docs|swagger-ui)[^\\.]*}",
        "/**/{path:^(?!api|uploads|ws)[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
