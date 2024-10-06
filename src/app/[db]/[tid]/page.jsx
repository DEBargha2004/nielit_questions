import getQuestions from "@/actions/get-questions";

export default async function Page({ params: { db, tid } }) {
  const [columns, questions] = await getQuestions({ db, tid });

  const options = ["optiona", "optionb", "optionc", "optiond"];
  return (
    <div className="space-y-6">
      {questions.map((q, q_idx) => (
        <section key={q.id} className="space-y-3">
          <h1 className="text-lg font-medium">
            {q_idx + 1}.&nbsp;
            <span dangerouslySetInnerHTML={{ __html: q.question }} />
          </h1>
          <ul className="pl-5 list-decimal">
            {options.map((o, o_idx) => (
              <li key={o_idx} dangerouslySetInnerHTML={{ __html: q[o] }} />
            ))}
          </ul>
          <p>
            Answer:{" "}
            <span className="font-semibold">
              {options.indexOf(q.correctanswer) + 1}
            </span>
          </p>
          <hr />
        </section>
      ))}
    </div>
  );
}
