function test_parseEmailsWithNames() {
    Logger.log(parseEmailsWithNames('hello@hello.edu.cn, hello@hell.fr'))
    Logger.log(parseEmailsWithNames('hello@hlolo.com'))
    Logger.log(parseEmailsWithNames('NAME <hell@hello.fr>'))
    Logger.log(parseEmailsWithNames('"Cyrille" <first@domain.fr>, bla@bla.com, "Hey" <yo@yo.yo>'))
  }
  