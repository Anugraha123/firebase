import React from "react";
import firebase from "./firebase";

const useFetchList = () => {
  const [list, setList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("times")
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs;

        const newList = docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setList(newList);
        setLoading(false);
      });

      return () => unsubscribe();
  }, []);

  return { list, isLoading };
};

const Sort = () => {
  return (
    <>
      <p>
        Sort: &nbsp;
        <select>
          <option>fast 1st</option>
          <option>slow 1st</option>
          <option disabled>---</option>
          <option>title (a-z)</option>
          <option>title (z-a)</option>
        </select>
      </p>
    </>
  );
};

const List = () => {
  const { list: data, isLoading } = useFetchList();

  console.warn('listlist', {data})

  return (
    <>
      <Sort />

      {isLoading ? (
        "Loading ..."
      ) : (
        <ol>
          {data.map(({ id, title, time_seconds }, index) => (
            <li key={id + index}>
              <p>
                <b>{title}</b>
                &nbsp;
                <i>{time_seconds} seconds</i>
              </p>
            </li>
          ))}
        </ol>
      )}
    </>
  );
};

const Form = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const elements = event.target?.elements;
    const values = {};

    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      if (element?.id && element?.value) {
        values[element?.id] = element?.value;
      }
    }

    firebase
      .firestore()
      .collection("times")
      .add(values)
      .then(() => {
        event.target.reset();
      });
  };

  return (
    <form onSubmit={handleSubmit} autoComplete='off'>
      <fieldset>
        <legend>Add</legend>
        <label htmlFor="title">Title</label>
        <br />
        <input id="title" type="text" />
        <br />
        <br />

        <label htmlFor="time_seconds">Time</label>
        <br />
        <input id="time_seconds" type="number" placeholder="in seconds" />
        <br />
        <br />

        <button type="submit">Add</button>
      </fieldset>
    </form>
  );
};

function App() {
  return (
    <div>
      <List />

      <Form />
    </div>
  );
}

export default App;
