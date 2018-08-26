from allauth.account.adapter import DefaultAccountAdapter


class AccountAPIAdapter(DefaultAccountAdapter):
    def respond_email_verification_sent(self, request, user):
        """
        We don't need this redirect.
        """
        pass
