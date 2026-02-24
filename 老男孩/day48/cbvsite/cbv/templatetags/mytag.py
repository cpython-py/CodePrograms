from django import template
register = template.Library()
@register.filter
def xx(v1):
    return v1 + 'xx'
@register.filter
def xx2(v1, v2):
    return v1 + 'xx2' + v2

@register.simple_tag
def tag1(v1, v2, v3):
    return v1 + v2 + v3