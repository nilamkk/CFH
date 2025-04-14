package codebuddy.backend.configuration;

import codebuddy.backend.client.CodeForcesClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class HttpClientConfig {

    @Value("${client.codeforces.base.url}")
    private String codeForcesBaseUrl;

    @Bean
    public CodeForcesClient codeForcesClient() {
        WebClient webClient = WebClient.builder()
                .baseUrl(codeForcesBaseUrl)
                .codecs(configurer ->
                        configurer.defaultCodecs().maxInMemorySize(8 * 1024 * 1024) // In Bytes
                ).build(); // code forces all problems response is 2.5MB exceeding default 256KB, so we need to increase the size

        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(webClient))
                .build();
        return factory.createClient(CodeForcesClient.class);
    }
}
