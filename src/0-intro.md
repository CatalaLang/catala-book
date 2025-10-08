# Introduction

Welcome to the *Catala domain-specific programming language*, an introductory
book about Catala!

~~~admonish abstract title="TL;DR"
The Catala domain-specific language lets you annotate a legal
specification with executable and deployable code in an efficient,
high-assurance fashion. Automating the enforcement of a law or regulation
through the use of a computer program is not neutral for the Rule of Law as well
as the rights of users. Please tread lightly when considering automating
anything else than tax or social benefits computation.

Contrary to a rules engine, Catala is a fully-fledged programming language with
modular abstractions inspired by functional programming. But most importantly,
it enables real collaboration between lawyers and computer scientists by
allowing the practice of *pair programming* through *literate programming* for
writing and updating the programs and their legal specifications.
~~~

## Who Catala is for

~~~admonish warning title="Catala is not a general-purpose programming language"
Catala is a domain-specific programming language, hence its use is targeted to a
specific class of users and organizations.
~~~

### Multi-disciplinary teams

Catala is designed to be used by teams mixing legal and computer science
expertise. Indeed, automating the enforcement of a law or a regulation requires
bridging the ambiguity gap of the legal text to a computer program that knows
what to do in every possible situation. Bridging this ambiguity gap is one
of missions of lawyers, trained in interpreting legal texts and performing
legal research to come up with a decision that can be justified withing the
framework of the Rule of Law.

If lawyers should be deciding what the program does, they are not trained in
programming concepts and abstractions, nor do they know how to write thousands
of lines of code in a clean and maintainable fashion. Hence, the role of the
computer scientist is to ensure that the program automating the enforcement of a
law or regulation is clean, concise, featuring correctly-scoped abstractions
that prevent code duplication and ease maintenance and future changes. Moreover,
the computer scientist is also responsible for deploying the program in a bigger
IT system that might break its assumptions or stress its performance.

By reusing existing software engineering techniques and tools, while exhibiting
lawyer-friendly concepts at its surface, Catala lets lawyers and computer
scientists collaborate in a truly *agile* manner, going beyond the separation
between development and quality assurance teams that communicate only via test
cases and specification documents.

### Government agencies and public service organizations

Automating the enforcement of a law or regulation through a computer program is
no small task. To make sure all are treated fairly under the Rule of Law, your
program should exhaustively take into account every situation described by the
law or regulation. While automating only the most simple situation corresponding
to a majority of users might acceptable in certain situations, it cannot be the
basis for a production-ready public service. Indeed, creating a difference
between an automated "simple path" and a non-automated handling of complex
situation widens the digital divide, and increases confusion for users and case
workers alike.

Catala shines when the goal is to exhaustively automate with high assurance
a given law or regulation, and to maintain this automation over time. The
language and tooling will help you manage the growing complexity, maintenance
over legal changes, corner cases and production-ready deployment inside a legacy
IT system. If you are looking for a tool to make a first-level user-help chatbot
backend that only answers basic questions, or a simplified model of a law for an
economic study, then you should consider using other tools. On the other hand,
if you are in an organization responsible for running a public service like
taxes or social benefits, then you should have the means to properly engineer
the computer program responsible for the automation, and use Catala to help you
with it.

Because Catala compiles to mainstream programming languages like Python or C, it
yields portable source code libraries that are embeddable in virtually any IT
system, legacy or modern. More particularly, Catala programs can be deployed
behind a Web API or embarked in a desktop application, enabling "write once, use
anywhere". Hence, Catala is particularly suited to historical government
agencies that have been operating their IT systems for decades in the past, and
will continue to do so decades in the future.

### Students and academics in CS and/or Law

Formalizing law, which is a more general term for translating law into
executable computer code, has been a subject of scholarly attention for a very
long time. AI & Law has historically been the umbrella community for this line
of work, with three sequential trends: logic programming, ontologies, and now
machine learning and especially natural language processing. While these trends
have uncovered important results for formalizing law, big research questions
remain. How to model complex legal provisions spanning large corpuses? Can
formalizing law be automated? Can legal drafting be technologically augmented?
How to detect inconsistencies or loopholes by static or dynamic analysis?

With strong roots to the research community, its commitment to open-source, its
formalized semantics and its extensible compiler, Catala as a programming
language is an opportunity for student learning and research projects. While
teachers and students can use Catala for hands-on exploring of tax and social
benefits law, researchers can use Catala programs as datasets or program a new
analysis that can be readily deployed to the users of Catala.

If you're a student, a professor, or anything else actually, you're welcome to
use Catala for free and contribute back to it by filing issues, proposing pull
requests, or develop plugins and tooling around it.

## Who this book is for

This book is primarily geared towards programmers that want to learn Catala,
set up a project using it to translate some legal text into executable code, and
be guided through the process. The book assume basic knowledge of functional
programming idioms, and generally software engineering experience with another
mainstream programming language.

If you, a programmer, work in a multidisciplinary
team with one or several lawyers, it is up to you to explain to them what Catala
is and how to work with it. This guide will thus also cover various topics
around the collaboration between lawyers and programmers.

If you are a lawyer and stumble across this book, you are also welcome to read
it, although parts of it will not be relevant to you. You might checkout instead
introductory articles that set up the context around computer code, translating
law to computer code and introduce the specificities of Catala:


~~~admonish example title="Lawyer-friendly publications about Catala and coding the law" collapsible=true
* James Grimmelmann. 2023. "[The Structure and Legal Interpretation of
 Computer Programs](https://journalcrcl.org/crcl/article/view/19/13)". *Journal
 of Cross-Disciplinary Research in Computational Law* 1 (3).
* Liane Huttner, Denis Merigoux. 2022. "[Catala: Moving Towards the Future of
Legal Expert Systems](https://inria.hal.science/hal-02936606v3/document)".
*Artificial Intelligence and Law*.
* Sarah B. Lawsky. 2022. "[Coding the Code: Catala and Computationally
  Accessible Tax
  Law](https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID4291177_code337501.pdf?abstractid=4291177&mirid=1)". 75 *SMU
  Law Review* 535.
~~~

## How to use this book

The book is organized into two parts: the user guide and the reference guide.
While the user guide is meant to be read linearly and aimed at new users, the
reference guide is the go-to stop for checking items about the Catala language
and tooling as you're using it, whether you are a new or experienced user.

The user guide starts with [Chapter 1](./1-0-getting_started.md) and the Catala
equivalent of "*Hello, world!*" program. [Chapter 2](./2-0-tutorial.md) explains
the core concepts of Catala with a hands-on tutorial centered on the automation
of a basic, fictional tax system. Moving onto serious business, [Chapter
3](./3-project.md) dives into the setting up of a real-world Catala project with
version control, monitoring legal changes, testing, continuous integration,
automated deployment, etc. Finally, [Chapter 4](./4-0-howto.md) speeds up your
learning by answering to (almost) all the questions that you'll normally stumble
upon while coding the law with Catala.

In the reference guide, [Chapter 5](./5-catala.md) details all the features
available in the Catala language, while [Chapter
6](./6-clerk.md) focus on the command line interfaces and features of the two
binaries that you will be working with: `clerk` and `catala`.


~~~admonish  note title="Source code"
The source files from which this book is generated can be found on
[GitHub](https://github.com/CatalaLang/catala-book). While the contents of this
book are expected to correspond to the latest version of Catala, some
inconsistencies might appear. If you spot one, or have comments or suggestions
about the book, please [file an
issue](https://github.com/CatalaLang/catala-book/issues)!
~~~
