import ExpoModulesCore
import KlarnaMobileSDK

var authEvent = "AUTH_EVENT"
var signInEvent = "SIGNIN_EVENT"
var errorEvent = "ERROR_EVENT"
var otherEvent = "OTHER_EVENT"
var successStatus = "SUCCESS"
var errorStatus = "ERROR"

public class ExpoKlarnaAuthModule: Module {
    var klarnaSignInSDK: KlarnaSignInSDK?
    
    public func definition() -> ModuleDefinition {
        Name("ExpoKlarnaAuth")
        
        Events(signInEvent, authEvent, errorEvent, otherEvent)
        
        Function("klarnaSignIn") { (
            returnUrl: String,
            clientId: String,
            scope: String,
            market: String,
            klarnaEnv: String,
            region: String?,
            locale: String?
        ) in
            self.startKlarnaSignIn(
                returnUrl: returnUrl,
                clientId: clientId,
                scope: scope,
                market: market,
                klarnaEnv: klarnaEnv,
                region: region,
                locale: locale
            )
        }

        View(ExpoKlarnaAuthView.self) {}
    }
}

@available(iOS 13.0, *)
extension ExpoKlarnaAuthModule {
    public func startKlarnaSignIn(
        returnUrl: String,
        clientId: String,
        scope: String,
        market: String,
        klarnaEnv: String,
        region: String? = nil,
        locale: String? = nil
    ) {
        DispatchQueue.main.async {
            let klarnaRegion = self.getKlarnaRegion(region)
            let klarnaEnvironment = self.getKlarnaEnvironment(klarnaEnv)
            guard let returnUrl = URL(string: returnUrl) else {
                self.sendErrorEvent("RETURN_URL_PARSE_ERROR")
                
                return
            }
            
            self.klarnaSignInSDK = KlarnaSignInSDK(
                environment: klarnaEnvironment,
                region: klarnaRegion,
                returnUrl: returnUrl,
                eventHandler: self
            )

            guard let klarnaSignInSDK = self.klarnaSignInSDK else {
                self.sendErrorEvent("NO_KLARNA_SIGN_IN_SDK")

                return
            }
            
            let signInButtonView = ExpoKlarnaAuthView()
            
            klarnaSignInSDK.signIn(
                clientId: clientId,
                scope: scope,
                market: market,
                locale: locale ?? "en-SE",
                tokenizationId: nil,
                presentationContext: signInButtonView
            )
        }
    }
}

@available(iOS 13.0, *)
extension ExpoKlarnaAuthModule: KlarnaEventHandler {
    public func klarnaComponent(_ klarnaComponent: KlarnaComponent, dispatchedEvent event: KlarnaProductEvent) {
        if event.action == .klarnaSignInToken {
            sendTokenEvent(event)
        } else if event.action == .klarnaSignInUserCancelled {
            sendErrorEvent(event.action)
        } else if event.action == .klarnaSignInAuth {
            sendAuthEvent(event.action)
        } else {
            sendOtherEvent(event.action)
        }
    }

    public func klarnaComponent(_ klarnaComponent: KlarnaComponent, encounteredError error: KlarnaError) {
        sendErrorEvent(error.name)
    }
}

@available(iOS 13.0, *)
extension ExpoKlarnaAuthModule {
    public func sendErrorEvent(_ message: String?) {
        self.sendEvent(errorEvent, [
            "status": errorStatus,
            "message": message,
        ])
    }
    
    public func sendOtherEvent(_ message: String?) {
        self.sendEvent(otherEvent, [
            "status": successStatus,
            "message": message,
        ])
    }
    
    public func sendAuthEvent(_ message: String?) {
        self.sendEvent(authEvent, [
            "status": successStatus,
            "message": message,
        ])
    }
    
    public func sendTokenEvent(_ event: KlarnaProductEvent) {
        guard let token = event.params["klarnaToken"] as? KlarnaMobileSDK.KlarnaSignInToken else {
            self.sendEvent(errorEvent, [
                "status": errorStatus,
                "message": "KLARNA_SIGN_IN_TOKEN_ERROR",
            ])
            
            return
        }
        
        self.sendEvent(signInEvent, [
            "status": successStatus,
            "message": event.action,
            "accessToken": token.accessToken,
            "idToken": token.idToken,
            "refreshToken": token.refreshToken,
            "scope": token.scope,
            "tokenType": token.tokenType,
            "expiresIn": token.expiresIn
        ])
    }
    
    public func getKlarnaRegion(_ region: String?) -> KlarnaRegion {
        switch region?.lowercased() {
        case "eu":
            return .eu
        case "na":
            return .na
        case "oc":
            return .oc
        default:
            return .eu
        }
    }
    
    public func getKlarnaEnvironment(_ environment: String?) -> KlarnaEnvironment {
        switch environment?.lowercased() {
        case "demo":
            return .demo
        case "playground":
            return .playground
        case "production":
            return .production
        case "staging":
            return .staging
        default:
            return .production
        }
    }
}

