from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.db import models
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from .models import Book, Author, BookInstance, Genre, Language
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.decorators import login_required, permission_required
from django.urls import reverse
from .forms import RenewBookForm, usersignupform
from django.forms import ModelForm
from .models import BookInstance
import datetime
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User


# Create your views here.


#@login_required
def index(request):
    num_books=Book.objects.all().count()
    num_instances=BookInstance.objects.all().count()
    num_instances_available=BookInstance.objects.filter(status__exact='a').count()
    num_authors=Author.objects.count()
    num_genres_fantasy=Genre.objects.filter(name__iexact='fantasY').count()
    num_books_fantasy=Book.objects.filter(genre__name__icontains='fanTasy').count()
    num_visits=request.session.get('num_visits', 0)
    request.session["num_visits"]=num_visits + 1
    context={
        'num_books': num_books,
        'num_instances': num_instances,
        'num_instances_available': num_instances_available,
        'num_authors': num_authors,
        "num_genres_fantasy": num_genres_fantasy,
        'num_books_fantasy': num_books_fantasy,
        'num_visits': num_visits,
        }
    return render(request, 'catalog/index.html', context=context)

class BookListView(generic.ListView):
    model=Book
    context_object_name='book_list'
    template_name='catalog/book_list.html'
    paginate_by=2

    def get_queryset(self):
        return Book.objects.all()


class BookDetailView(LoginRequiredMixin, generic.DetailView):
    model=Book
    template_name='catalog/book_detail.html'
    
class AuthorListView(LoginRequiredMixin, generic.ListView):
    model=Author
    template_name="catalog/author_list.html"

class AuthorDetailView(LoginRequiredMixin, generic.DetailView):
    model=Author
    template_name="catalog/author_detail.html"

class UserLoanedBooksListView(LoginRequiredMixin, generic.ListView):
    model=BookInstance
    template_name='catalog/bookinstance_borrowed_user.html'
    paginate_by=10

    def get_queryset(self):
        return BookInstance.objects.filter(borrower=self.request.user).filter(status__exact='o').order_by('due_back')


class AllLoanedBooksLibrariansView(PermissionRequiredMixin, LoginRequiredMixin, generic.ListView):
    model=BookInstance
    permission_required='catalog.can_mark_returned'
    template_name='catalog/loanedbooks.html'
    paginate_by=10

    def get_queryset(self):
        return BookInstance.objects.filter(status__exact='o').order_by('due_back')

class staffborrowedbooksview(PermissionRequiredMixin, LoginRequiredMixin, generic.ListView):
    model=BookInstance
    template_name='catalog/staffborrowedbooks.html'
    permission_required="catalog.can_mark_returned"
    paginate_by=10

    def get_queryset(self):
        return BookInstance.objects.filter(borrower=self.request.user).filter(status__exact='o').order_by('due_back')

class RenewBookModelForm(ModelForm):
    def clean_due_back(self):
        data=self.cleaned_data['due_back']

        if data< datetime.date.today():
            raise ValidationError(_('Invalid date - renewal in past'))

        if data > datetime.date.today():
            raise ValidationError(_('Invalid date-renewal more than 4 weeks ahead'))
            
        return data
    class Meta:
        model = BookInstance
        fields=['due_back']
        labels={'due_back':_('New renewal date'), }
        help_texts={'due_back':_('Enter a date between now and 4weeks (default 3).')}

class userCreateview(CreateView):
    form_class=usersignupform
    template_name='catalog/usersignup.html'

    def form_valid(self, form):
        user=User.objects.create_user(email=self.request.POST['email'], username=self.request.POST['username'], password=self.request.POST['password'], )
        return redirect('catalog:index')

@login_required
@permission_required('catalog.can_mark_returned', raise_exception=True)
def renew_book_librarian(request, pk):
    book_instance=get_object_or_404(BookInstance, pk=pk)
    #if it's wa post request(meaning it's validation)plug in values from the form into the form.py 
    if request.method=='POST':
        form=RenewBookModelForm(request.POST)

        #if form is  valid
        if form.is_valid():
            book_instance.due_back=form.cleaned_data['due_back']
            book_instance.save()
            return HttpResponseRedirect(reverse('catalog:all-borrowed'))
    #if its get battery
    # ate form 
    else:
        proposed_renewal_date=datetime.date.today() + datetime.timedelta(weeks=3)
        form=RenewBookModelForm(initial={'due_back':proposed_renewal_date})
    
    context={
        'form': form,
        'book_instance':book_instance  
    }

    return render(request, 'catalog/book_renew_librarian.html', context)

class AuthorCreate(CreateView):
    model=Author
    fields=['first_name' , 'last_name', 'date_of_birth', 'date_of_death']
    initial={'date_of_death': '11/06/2020' }

class AuthorUpdate(UpdateView):
    model=Author
    fields='__all__'

class AuthorDelete(DeleteView):
    model=Author
    success_url=reverse_lazy('catalog:authors')

class BookCreate(CreateView):
    model=Book
    fields='__all__'
    

class BookUpdate(UpdateView):
    model=Book
    fields='__all__'

class BookDelete(DeleteView):
    model=Book
    success_url=reverse_lazy('catalog:books')