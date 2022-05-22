package org.acme;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class GenerateOpenApiTest {

    @Test
    void generate(){
        //openapi.yaml is generated during startup in tests (@QuarkusTest).
    }

}
