package service;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CustomHeaderFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialisation du filtre
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Ajoutez vos en-t�tes personnalis�s ici
        httpResponse.addHeader("Custom-Header", "Valeur personnalis�e");

        // Passez la requ�te au filtre suivant
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Destruction du filtre
    }
}