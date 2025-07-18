# Agile development with lawyers and programmers

At this point, you have set up the technical project environment and are ready
to start developping in Catala. But before translating your first legal text
into code, you should also set up a proper organisation and methodology to make
sure that your translation efforts are as productive as possible, and lead to
the code with the least amount of bugs on the first try.

## Why you should avoid writing intermediate specification documents

A common trope of large organizations tasked with automating decision-making
based on legal specifications is to produce various textual documents serving as
"specifications" that sit between the source legal texts and the executable code
automating the decisions.

~~~admonish example title="A typical V-shaped process to translate law to code"
Imagine you are in a government agency tasked with distributing a benefit. 
The legal base for the benefit is written in a law; this law is interpreted 
by the ministry whichs takes out a decree (or executive order), further
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
the correct level of responsability as to the effects of those decisions on the
future recipients of the benefit.

But each step of producing a new document from the previous one, and sending it
over to a new team of people, increases the risk of mistakes and
incomprehensions, in a real-world game of administrative Chinese whispers.
Usually, these mistakes and incomprehensions are constantly resolved by
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

## Whhy you should pick the legal texts for the literate programming in Catala

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
in that way.

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~


~~~admonish tip title="Documenting internal micro-choices in the code"

~~~

## Recruiting a team mixing programming and domain knowledge

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~


## Pair programming sessions and homework

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~

## Tracking progress and planning the work

~~~admonish danger title="Work in progress"
This section of the Catala book has not yet been written, stay tuned for
future updates!
~~~
