package expo.modules.klarnaauth

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import com.klarna.mobile.sdk.api.KlarnaRegion
import com.klarna.mobile.sdk.KlarnaMobileSDKError
import com.klarna.mobile.sdk.api.KlarnaEnvironment
import com.klarna.mobile.sdk.api.KlarnaProductEvent
import com.klarna.mobile.sdk.api.KlarnaEventHandler
import com.klarna.mobile.sdk.api.signin.KlarnaSignInSDK
import com.klarna.mobile.sdk.api.signin.KlarnaSignInEvent
import com.klarna.mobile.sdk.api.component.KlarnaComponent
import com.klarna.mobile.sdk.api.signin.model.KlarnaSignInToken

class ExpoKlarnaAuthModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoKlarnaAuth")

        Events("onChange")

        Function("klarnaSignIn") {
                returnURL: String,
                clientId: String,
                scope: String,
                market: String,
                klarnaEnv: String,
                region: String?,
                locale: String?,
            ->
            klarnaSignIn(
                returnURL,
                clientId,
                scope,
                market,
                klarnaEnv,
                region,
                locale,
            )
        }

        View(ExpoKlarnaAuthView::class) {}
    }

    private fun klarnaSignIn(
        returnURL: String,
        clientId: String,
        scope: String,
        market: String,
        klarnaEnv: String,
        region: String?,
        locale: String?,
    ) {
        val activity = appContext.currentActivity

        if (activity == null) {
            sendErrorEvent("NO_ACTIVITY")

            return
        }

        val eventHandler = object : KlarnaEventHandler {
            override fun onEvent(klarnaComponent: KlarnaComponent, event: KlarnaProductEvent) {
                when (event.action) {
                    KlarnaSignInEvent.USER_CANCELLED -> sendErrorEvent(KlarnaSignInEvent.USER_CANCELLED)
                    KlarnaSignInEvent.SIGN_IN_TOKEN -> sendTokenEvent(event)
                    else -> {
                        sendSuccessEvent(event.action)
                    }
                }
            }

            override fun onError(klarnaComponent: KlarnaComponent, error: KlarnaMobileSDKError) {
                sendErrorEvent(error.name)
            }
        }

        activity.runOnUiThread {
            try {
                val klarnaSignInSDK = KlarnaSignInSDK(activity, returnURL, eventHandler, getKlarnaEnvironment(klarnaEnv), getKlarnaRegion(region))

                klarnaSignInSDK.signIn(clientId, scope, market, locale)
            } catch (e: Exception) {
                sendErrorEvent("UNEXPECTED_ERROR")
            }
        }
    }

    private fun sendErrorEvent(message: String) {
        sendEvent("onChange", mapOf("status" to "ERROR", "message" to message))
    }

    private fun sendSuccessEvent(message: String) {
        sendEvent("onChange", mapOf("status" to "SUCCESS", "message" to message))
    }

    private fun sendTokenEvent(event: KlarnaProductEvent) {
        val token = event.params[KlarnaSignInEvent.ParamKey.KlarnaSignInToken] as? KlarnaSignInToken

        sendEvent("onChange", mapOf(
            "status" to "SUCCESS",
            "message" to event.action,
            "accessToken" to token?.accessToken,
            "idToken" to token?.idToken,
            "refreshToken" to token?.refreshToken,
            "scope" to token?.scope,
            "tokenType" to token?.tokenType,
            "expiresIn" to token?.expiresIn
        ))
    }

    private fun getKlarnaEnvironment(env: String): KlarnaEnvironment {
        return when (env.uppercase()) {
            "DEMO" -> KlarnaEnvironment.DEMO
            "PLAYGROUND" -> KlarnaEnvironment.PLAYGROUND
            "PRODUCTION" -> KlarnaEnvironment.PRODUCTION
            "STAGING" -> KlarnaEnvironment.STAGING
            else -> KlarnaEnvironment.getDefault()
        }
    }

    private fun getKlarnaRegion(region: String?): KlarnaRegion? {
        return when (region?.uppercase()) {
            "EU" -> KlarnaRegion.EU
            "NA" -> KlarnaRegion.NA
            "OC" -> KlarnaRegion.OC
            else -> null
        }
    }
}
