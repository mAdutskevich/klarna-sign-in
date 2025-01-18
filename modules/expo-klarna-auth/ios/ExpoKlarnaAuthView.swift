import ExpoModulesCore
import AuthenticationServices

class ExpoKlarnaAuthView: ExpoView, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        
        guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) else {
            fatalError("WINDOW_NOT_SET")
        }
        
        return window
    }
}
