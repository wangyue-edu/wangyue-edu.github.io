"""Regression checks for the leaks found during the contact audit."""
import hashlib,io,unittest,zipfile
from unittest.mock import patch
from contact_privacy import contact_spans,redact_contacts
from sanitize_public_contacts import sanitize_xml,transform

class PrivacyRegressionTests(unittest.TestCase):
    def test_chinese_prefix_and_descriptive_qq_label(self):
        for text in ['官方QQ：123456789','社团QQ群: 123456789','请加QQ 群咨询相关事宜：123456789']:
            self.assertNotIn('123456789',redact_contacts(text))
    def test_technology_and_historical_pin_are_preserved(self):
        text='QQ 客户端通过 HTTP 工作；AT+PSWD=4444'
        self.assertEqual(text,redact_contacts(text))
    def test_broken_word_runs_and_hidden_link_target(self):
        xml=b'<root xmlns:w="urn:test"><w:p><w:r><w:t>person</w:t></w:r><w:r><w:t>@sample.invalid</w:t></w:r></w:p><Relationship Target="mailto:person@sample.invalid"/></root>'
        clean=sanitize_xml(xml)
        self.assertNotIn(b'sample.invalid',clean)
        self.assertIn(b'example.invalid/redacted',clean)
    def test_qq_inside_office_xml(self):
        xml='<root><p><t>官方QQ：</t><t>123456789</t></p></root>'.encode()
        self.assertNotIn(b'123456789',sanitize_xml(xml))
    def test_survey_is_removed_including_hidden_strings(self):
        office=io.BytesIO()
        with zipfile.ZipFile(office,'w') as z:z.writestr('xl/sharedStrings.xml','<sst><si>Hidden private respondent</si></sst>')
        package=io.BytesIO()
        with zipfile.ZipFile(package,'w') as z:
            z.writestr('附件2：机器人社团招新问卷调查（收集结果）.xlsx',office.getvalue());z.writestr('main.cpp','int main(){}')
        clean=transform('sample.zip',package.getvalue())
        with zipfile.ZipFile(io.BytesIO(clean)) as z:self.assertEqual(z.namelist(),['main.cpp'])
    def test_qq_query_parameter(self):
        text='https://example.invalid/contact?uin=123456789'
        self.assertNotIn('123456789',redact_contacts(text))
    def test_fixed_length_and_newlines(self):
        text='email: author@sample.invalid\n官方QQ：123456789'
        clean=redact_contacts(text)
        self.assertEqual(len(clean),len(text));self.assertEqual(clean.count('\n'),1);self.assertFalse(contact_spans(clean))
    def test_owner_approved_apk_is_preserved_byte_for_byte(self):
        package=io.BytesIO()
        with zipfile.ZipFile(package,'w') as z:z.writestr('res/raw/qt_copyright.txt','License contact: author@sample.invalid')
        data=package.getvalue();h=hashlib.sha256(data).hexdigest()
        with patch('sanitize_public_contacts.ALLOWED_APKS',{h}):
            self.assertEqual(data,transform('owner-approved.apk',data,remove_contact_apks=True))
if __name__=='__main__':unittest.main()
