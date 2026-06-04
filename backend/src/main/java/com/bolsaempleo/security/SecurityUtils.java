package com.bolsaempleo.security;

import com.bolsaempleo.exception.BusinessRuleException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
        throw new UnsupportedOperationException("Esta es una clase utilitaria y no puede ser instanciada.");
    }

    /**
     * Obtiene el UserPrincipal completo del usuario autenticado en el hilo actual.
     * @return El UserPrincipal que representa la sesión del usuario.
     * @throws BusinessRuleException Si no existe una sesión válida o activa en el contexto.
     */
    public static UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() 
                || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BusinessRuleException("Operación rechazada: No se detectó un usuario autenticado en la sesión actual.");
        }
        
        return principal;
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public static String getCurrentUserEmail() {
        return getCurrentUser().getUsername();
    }
}