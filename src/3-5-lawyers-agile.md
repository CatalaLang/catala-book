# Agile development with lawyers and programmers

<div id="tocw"></div>

At this point of the walkthrough, you should have set up the technical project
environment and are ready to start developping in Catala. But even if it's not
the case, and before starting to translate your first legal text into code, you
should also set up a proper organisation and methodology to make sure that your
translation efforts are as productive as possible, and lead to the code with the
least amount of bugs on the first try. This section provides advice and
justifications for some of the most important project decisions that you will
have to have to make. Furthermore, it gives practical indications for how to
adapt the [agile methodology](https://agilemanifesto.org/) of programming to the
task of translating law into code, which requires a safety-first culture and
organizational environment.

## Why you should avoid writing intermediate specification documents

A common trope of large organizations tasked with automating decision-making
based on legal specifications is to produce various textual documents serving as
"specifications" that sit between the source legal texts and the executable code
automating the decisions.

~~~admonish danger title="A typical V-shaped process to translate law to code (not recommended)"
Imagine you are in a government agency tasked with distributing a benefit.
The legal base for the benefit is written in a law; this law is interpreted
by the ministry which takes out a decree (or executive order), further
outlining the computation rules for the benefit. Inside your agency, the
legal department usually takes the law and the decree, and writes official
instructions summarizing how the agency interprets the law and the decree.
Then, these instructions are sent to the operations department that writes
a set of specifications detailing all the computation rules of the benefit
for automating the computation. Finally, the IT department takes the
specifications and writes the executable code, or delegates the programming
to a contractor. All in all, here are the
different documents co-existing in the process:
1. the law (enacted by Parliament);
2. the decree (enacted by the ministry);
3. the instructions (written by the legal department of the agency);
4. the specifications (written by the operational department of the agency);
5. the executable code (written by the IT department of the agency).
~~~

Now, each document builds on the previous one by going into more detail and
taking more and more micro-decisions about how the benefit should be computed.
These micro-decisions are crucial and they need to be taken at each level with
the correct level of responsibility as to the effects of those decisions on the
future recipients of the benefit.

But each step of producing a new document from the previous one, and sending it
over to a new team of people, increases the risk of mistakes and
misunderstandings, in a real-world game of administrative Chinese whispers.
Usually, these mistakes and misunderstandings are constantly resolved by
extensive phone calls between the different teams of your agency over the
documents they just sent over. These phone calls lead to a lot of
decision-making that often leaves no written trace. Accumulated over time, this
work methodology leads to specifications whose rules cannot be traced back to a
legal basis in the law and decree, and who risk diverging or even contradicting
the instructions of your own agency's legal department. This harms internal
efficiency and makes it impossible to satisfy the legal framework for automated
decision-making that imposes strict transparency norms.

More globally, the complexity of the processes required to translate legal
requirements into executable code for automated decision-making is the target of
the "Rules as Code" movement [promoted by the
OECD](https://oecd-opsi.org/publications/cracking-the-code/). The ultimate goal
of "Rules as Code" is to shrink all the steps of the process described above and
directly publish law and decrees as executable code. While one may think that
Catala directly enables this ultimate goal, the Catala team does not think that
it is desirable, given the considerable impacts it would have on the [Rule of
Law](https://publications.cohubicol.com/research-studies/computational-law/) .

Instead, the Catala team recommends using Catala to collapse the last two steps
of the process and merge in the Catala source code file both the executable
code, and all the texts that provide the legal basis for your agency. The rest
of this page will explain more concretely how to achieve this.


~~~admonish info title="Further reading" collapsible=true
The description above is a summary of a line of socio-technical research
led by the Catala team. You can find extensive writeups with legal analysis
and field studies corroborating the findings in the following publications:

* Liane Huttner, Denis Merigoux. *Catala: Moving Towards the Future of Legal Expert Systems*. Artificial Intelligence and Law, 2022, ⟨10.1007/s10506-022-09328-5⟩. [⟨hal-02936606⟩](https://inria.hal.science/hal-02936606/).
* Denis Merigoux, Marie Alauzen, Lilya Slimani. *Rules, Computation and Politics. Scrutinizing Unnoticed Programming Choices in French Housing Benefits*. Journal of Cross-disciplinary Research in Computational Law, 2023, 2 (1), pp.23. [⟨hal-03712130v3⟩](https://inria.hal.science/hal-03712130)
* Denis Merigoux, Marie Alauzen, Justine Banuls, Louis Gesbert, Émile Rolley. *De la transparence à l’explicabilité automatisée des algorithmes : comprendre les obstacles informatiques, juridiques et organisationnels*. RR-9535, INRIA Paris. 2024, pp.68. [⟨hal-04391612⟩](https://inria.hal.science/hal-04391612)
~~~

## Why you should pick the legal texts for the literate programming in Catala

As explained above, usually the programmers only refer to the specifications
when writing their code, and not from the legal texts from which the
specifications have been derived from. Hence, it would make sense on a first
glance to simply use the specifications as the starting point of the literate
programming. While it is technically possible, the Catala team would not
recommend it as this prevents the rewriting effort to Catala from reconstructing
the *chain of justifications of the micro-choices from the legal text to the
executable code*.

Indeed, the whole point of [literate
programming](https://en.wikipedia.org/wiki/Literate_programming) is to merge in
a *single document* both the code and the explanation about why the code works
in that way. Applied to Catala, literate programming means that the explanation
of why the code works that way should contain the legal basis for its behavior,
hence the legal texts.

Furthermore, using the legal texts in the literate programming instead of the
specifications speeds up code maintenance significantly. Indeed, whenever there
is an update in the legal texts, it suffices to propagate the update to the copy
of the legal text in the Catala file (a process that can be automated), and then
updating (manually) the snippets of code that lie just below the updated legal
texts. The knowledge of which piece of code corresponds to which part of the
legal text is *explicit*, making it more robust to personnel change or loss of
institutional memory. Compare that with the traditional process of updating the
specification, and then updating the code: the specification writer and the code
writer (usually two different persons) have to remember which part of the
document they write correspond to the updated parts of the document they
receive.

**Overall, using the legal texts for the Catala literate programming ensures the
consistency of the documentation for the interpretative choices, as well as the
robustness and efficiency of the future updates to the code.**

~~~~~~admonish success title="Documenting internal micro-choices in the code"
Once you have chosen to start with the legal texts as the basis for your literate
programming in Catala, one issue quickly arises: where to put all the information
that documents the disambiguation of the legal texts into the executable code?

This information is usually partly stored in the official instructions published
by your agency, or scattered across internal memos and emails sent along
hierarchical chains. Theses instructions, memos and email often paraphrase the
legal texts, while adding an extra bit of information that contains the disambiguation
you are looking for.

One solution could be to copy-paste the text of the instructions, memos and
emails and put them next to the legal text in the Catala source file. But doing that
will quickly clutter your codebase and force you into an awkward choice: where to put
the snippets of Catala code? Under the piece of legal text or under the piece
of memos that paraphrases the legal text? There is no good answer to that;
furthermore, copy-pasting the instructions and memos systematically in your
codebase amounts to doing the literate programming with the specifications
instead of the legal texts, which we showed is not desirable.

Instead, the Catala team advises you to **not** copy-paste the text of instructions,
memos and emails inside your literate programming codebase alongside the legal
texts, but rather to **reference** them inside code comments. Indeed, code comments
are precisely here to document choices in the code, making them the perfect
placed to insert justifications for legal texts disambiguation referencing
instructions, memos or emails. For instance, here is what a typical Catala
source code file could look like for a fictitious legal example involving
some income deduction computation:

---

#### Article 364

The income deduction mentioned at article 234 is capped at $10,000.

```catala
scope GrossToNetIncomeIndividual:
  # A literal reading of article 364 would entail putting $10,000 here. But
  # actually, agency instruction N°1045-58 published on 28/04/2023 specifies
  # that the cap is estimated at the household and not the individual level.
  # To reconcile with the individual view of article 364, the cap here should
  # be a pro-rata of the household cap with respect to the income of each
  # individual. We assume that this pro-rata is supplied as the input variable
  # "pro_rata_deduction_cap" of scope "GrossToNetIncomeIndividual".
  definition income_deduction state capping equals
    pro_rata_deduction_cap

# Now we have to compute "pro_rata_deduction_cap" of scope
# "GrossToNetIncomeIndividual", at the household level. But actually, an internal
# memo sent by the legal department to the IT department on 05/09/2023 further
# specifies that the household-level cap should only be pro-rated if the sum
# of the incomes of the individuals in the household is greater than the cap.
# Otherwise, each individual should see as its individual cap the cap of the
# whole household. This is equivalent because if the sum of the incomes is below
# the cap, then the capping operation will not yield any effect.
scope GrossToNetIncomeHousehold:
  ...
```

---

As you can see, on top of the legal text, the amount of comments inside the
Catala code can be consequent. The more the legal text is concise and ambiguous,
the more code comments and references to agency documentation will be needed
to explain how it was disambiguated! These code comments should be very carefully
written with context, specific information and references so that they are
sufficient for a newcomer on the project to reconstruct the argument explaining
why the code looks the way it does. Writing good comments takes time initially
but keeping such a practice consistent will save you headaches in the future
and ensure long-term maintainability of the codebase.
~~~~~~

## Recruiting a team mixing programming and domain knowledge

~~~admonish info title="Writing Catala code actually mostly involves finding out what the law means"
During its experiments and research efforts, the Catala team noticed
that the vast majority of the time (70% to 90%) spent on the projects to
translate law into Catala code was spent not writing code, but **figuring
out what the law meant and how to interpret it correctly with respect
to agency guidelines**.

This means that the bottleneck for project progress is not the coding speed
but rather the speed at which the team is collectively able to find out what
the law means and how to interpret it. And software engineers do not have
the best skill set for this task.

If you want to read more about lawyer-programmer interaction in the production
of software automating the law, please refer to:
* Nel Escher, Jeffrey Bilik, Nikola Banovic, and Ben Green. 2024. *Code-ifying the Law: How Disciplinary Divides Afflict the Development of Legal Software*. Proc. ACM Hum.-Comput. Interact. 8, CSCW2, Article 398 (November 2024), 37 pages. [https://doi.org/10.1145/3686937](https://dl.acm.org/doi/10.1145/3686937)
~~~

For this reason, the Catala team advises to have an **equally balanced mix**
between people who can write good code (usually software engineers) and people
who can figure out what the law means and interpret it (usually lawyers but not
always, as we will see) inside your multi-disciplinary team. This equal mix
entails that you can organize the team into pairs of people: one lawyer and one
programmer. You can scale up the development effort by increasing the number of
pairs in your team that can be assigned to independent parts of the computation.

We will see below how the programmers and lawyers spend their time during a
typical week. But first, let us talk about what kind of "lawyers" we are talking
about in our multi-disciplinary teams. The word "lawyers" usually refers to
attorneys, meaning people defending individuals and company in court during a
lawsuit. But administrative agencies employ very few of this kind of lawyers,
and those people are only devoted to handling the lawsuits in which the agency
is involved. Instead, administrative agencies usually employ a fair amount of
people formally trained in Law at universities in their central legal
department, tasked with identifying and monitoring all the legal texts that the
agency should comply with. These "lawyers" then usually write the official
instructions of the agency that paraphrase the legal text, while taking past
court cases decisions and the official doctrine of the agency into account. This
corresponds to step 3. of the V-shaped process described earlier in this page.

Then, step 4. of the process still involves further interpretations of the law.
But this time, it is often done by people that do not have a formal university
training in law, and that do not call themselves "lawyers". However, these people
have a extensive and specialized knowledge of the legal content at hand, based
on decades of prior experience in their positions, or as field case workers
inside the agency. Sometimes, these people have never seen the legal texts for
the benefit or tax in which they are specialized, they have ever only read the
official instructions of the agency written by the in-house legal department.
The Catala team call these people the "domain experts", and they are as crucial
as the "lawyers" to ensure that the chain between the legal basis and the
executable code is fully justified in a Catala source code file.

Hence, the Catala team recommends to include a mix of "domain experts"
and legal-department-type "lawyers" inside your team along with the software
engineers. It is the combination of the legal theory point of view with the
experience of the practice of this law in the agency that is key to achieve
the consistency of the software written in Catala with both the existing systems
it is meant to replace and the official legal doctrine of the agency it is supposed
to comply with.

~~~admonish question title="The legal/domain experts are unavailable, how do I do?"
Because employee turnover is high in organizations, especially at demanding
positions, it is often difficult to find experts with sufficient experience
with the law at hand inside the agency, and more often than not those people
are already overburdened with maintaining the current IT projects of
the agency without time to invest in a Catala modernization effort.

Hence, it will be difficult to staff your team with an all-star roster of
legal/domain experts. The Catala team advises that you see this as an opportunity
to recruit and train new legal/domain experts that will develop new expertise
as the project using Catala is going along. Indeed, the Catala team empirically
witnessed during early experiments using freshly graduated lawyers that the task
of producing Catala implementation of a piece of law is a very efficient way
for lawyers to quickly specialize and master this piece of law.

However, this training process is only efficient if the lawyer in training
has access (one hour every week or two weeks for instance) to a really experienced
domain expert that can clear out of memory all the remaining questions that the
training lawyer could not figure by themselves.
~~~


## Weekly schedule: pair programming sessions and homework

Once you have assembled your team according to the principles laid out above,
you will need to set up tasks for each of your lawyer-programmer pairs. For
each chunk of work (whether it is implementing a certain section of a statute or
a certain scope pre-determined to be important in the computation), the work
should follow an iterative loop made of the following steps:

1. Identify the legal sources and agency instructions and memo justifying the
  chunk of computation;
2. Copy-paste them into a Catala source code file and scaffold the data
  structure and scope declarations;
3. Work you way linearly through the legal sources, making sure you put the
  Catala code as close as possible to the legal source that justify it;
4. During the implementation work, code refactoring duties and legal research
  questions will inevitably arise;
5. Deal with them by iterating back to the previous steps of this loop;
6. You are finished when no more new refactoring duties or legal research
  questions arise!

While following the previous loops, both the programmer and the lawyer in the
pair will be occupied full-time during a typical week. The organization of the
week for both should be centered around a weekly 2-to-3-hour long pair
programming session, with the following pattern:
* before the pair programming session, the lawyer should send to the
  programmer the lists of legal texts to take into account for the current
  chunk of work;
* based on this the programmer should write an initial scaffolding of data structure
  and scope declarations to be used during the pair programming session;
* the lawyer should also preventively research relevant court cases and agency
  doctrine document before the pair programming session;
* a agenda is commonly set by the lawyer and the programmer for the upcoming
  pair programming session, prioritizing the tasks at hand;
* during the pair programming session, the lawyer and programmer should discuss
  the text of law and try to sketch or implement fully snippets of Catala
  code (usually [scope variable definitions](./5-4-definitions-exceptions.md#definitions-and-exceptions));
* they should also duly note any refactoring duty or legal research questions
  that arise during the session as to-do tasks;
* these to-do tasks should occupy both the lawyer and the programmer after
  the pair programming session and before the next one;
* additionally, the lawyer should asynchronously prepare test cases that that
  the programmer (or the lawyer) can implement and add to the test base for
  continuous integration;
* when finished, the chunk of work is materialized as a merge-request proposal
  complete with implementation and tests, to be reviewed both legally and
  computationally by another lawyer-programmer pair.

If all of this does not fill the working week, the programmer can work additionally
on deployment-related programming tasks of the project while the lawyer can
work on writing internal memos documenting the progress of the project and
how the decisions they made while programming conform to the doctrine of the
agency.

## Tracking progress and planning the work

Globally, you know that you will reimplement a certain tax or benefit
computation, but how to divvy up the work into tasks and distributing them to
the pairs?

~~~admonish note title="Working in the order of the law or in the order of the computation?"
There are two strategies for dividing up the implementation work into chunks.

The first one that would correspond the most to the literate programming methodology
is to first gather up all the legal texts and references to instructions and
internal memos, lay them all out in Catala text files structured by legal
source, and then proceed to implement each piece of law in the order in which
it is written in the legal source. The Catala teams has already tried out this
strategy. Its main advantage is that is leads to being very exhaustive with
respect to the code, and following the path of the legal text helps understanding
it more quickly (if it is well-written !). However, this strategy does not ensure
that parts of the computation will be incrementally ready to test and deploy
in a continuous manner during the project, and it leads to a lot of refactoring
to take into account new legal provisions as they appear in the text.

Overall, the Catala team would only recommend this first strategy if the benefit
or tax at hand *has never been automated before in the agency* and/or if the internal
level of expertise about it is low. In all other cases, the Catala team recommends
following second strategy.

The second strategy is to divvy up the computation of the tax or social
benefit using an already known division plan that matches the functional division
of the computational contents. For instance, you already know that the benefit is
divided between eligibility and computation of the amount, the the eligibility
computation is divided between income conditions and other conditions, etc.
From this known division plan, you can already write in your "prologue" Catala
file initial declarations for data structures, scopes and modules of your
upcoming implementation. Then, you can incrementally implement each module or
scope by pulling out all the legal sources as you need them to justify the
current computation, and copy-pasting them in the Catala source file on demand.
In the end, the source files should still be organized roughly by legal source
like in the first method, but the paths to fill out the files will be completely
different.
~~~

For day-to-day project management, the Catala team advises you to make full use
of software engineering platforms like Github, Gitlab or Jira. Not only
can the coding tasks be modeled and tracked as issues and pull request on these
platforms, but the legal tasks can also be modeled and tracked as issues.
In particular, the Catala team has noted that it is very useful to put all of
the to-do tasks collected at the end of a pair programming session under the
form of issues in the platform. Then, project progress can be tracked with
issue boards, lists and time estimation like a standard software project.

You can also use issue tags to mark up legal questions that have been researched
or validated by the agency's legal department. Tagging issues makes it easier
to plan ahead the agenda of the next pair programming session and sort between
the tasks that still need further research or validation, and those that can
be implemented into Catala code right away.
