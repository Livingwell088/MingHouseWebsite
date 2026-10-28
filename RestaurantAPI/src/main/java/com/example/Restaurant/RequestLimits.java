package com.example.Restaurant;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/** Bounded per-instance abuse limits; proxy headers are deliberately not trusted. */
@Component @Order(-110)
public class RequestLimits extends OncePerRequestFilter {
    private record Bucket(long window, int count) {}
    private final ConcurrentHashMap<String,Bucket> buckets=new ConcurrentHashMap<>();
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws IOException,ServletException {
        if (request.getContentLengthLong()>262144) { response.sendError(413); return; }
        String path=request.getRequestURI();
        boolean limited=path.equals("/users/validate") || path.equals("/users/add") || path.equals("/carts/generate");
        if (limited) {
            long window=System.currentTimeMillis()/60000;
            if (buckets.size()>10000) buckets.entrySet().removeIf(e -> e.getValue().window()<window);
            if (buckets.size()>10000) { response.sendError(429); return; }
            String key=request.getRemoteAddr()+":"+path;
            Bucket bucket=buckets.compute(key,(k,old)-> new Bucket(window,old!=null && old.window()==window ? old.count()+1:1));
            if (bucket.count()>60) { response.setHeader("Retry-After","60"); response.sendError(429); return; }
        }
        if (java.util.Set.of("POST","PUT","PATCH").contains(request.getMethod())) {
            byte[] body=request.getInputStream().readNBytes(262145);
            if (body.length>262144) { response.sendError(413); return; }
            HttpServletRequestWrapper bounded=new HttpServletRequestWrapper(request) {
                @Override public ServletInputStream getInputStream() {
                    var source=new java.io.ByteArrayInputStream(body);
                    return new ServletInputStream() {
                        public int read() { return source.read(); }
                        public boolean isFinished() { return source.available()==0; }
                        public boolean isReady() { return true; }
                        public void setReadListener(ReadListener listener) { throw new UnsupportedOperationException("Synchronous requests only"); }
                    };
                }
                @Override public java.io.BufferedReader getReader() {
                    return new java.io.BufferedReader(new java.io.InputStreamReader(getInputStream(),java.nio.charset.StandardCharsets.UTF_8));
                }
            };
            chain.doFilter(bounded,response);
        } else chain.doFilter(request,response);
    }
}
