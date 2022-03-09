import datetime
from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms import ModelForm


class RenewBookForm(forms.Form):
    renewal_date=forms.DateField(help_text="<b>enter a date between now and 4 weeks (default 3).</b>")

    def clean_renewal_date(self):
        data=self.cleaned_data['renewal_date']

        if data<datetime.date.today():
            raise ValidationError(_('Invalid date - renewal in past'))

        if data>datetime.date.today() + datetime.timedelta(weeks=4):
            raise ValidationError(_('Invalid date - renewal more than 4 weeks ahead'))
        return data

class usersignupform(ModelForm):
        class Meta:
            model=User
            fields=['email', 'username', 'password']
            widgets={'password': forms.PasswordInput()}