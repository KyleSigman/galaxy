import React from "react"

export default function Dodo({
  clazz,

  handleDelete,

}) {

  const [newTitle, setNewTitle] = React.useState(clazz.runclass);

  const handleChange = (e) => {
    e.preventDefault();
    if (clazz.complete === true) {
      setNewTitle(clazz.runclass);
    } else {
      clazz.runclass = "";
      setNewTitle(e.target.value);
    }
  };

  return (

    <div className="classcontent">
      <h2>{clazz.runclass}</h2>
      <input
        type="text"
        value={clazz.runclass === "" ? newTitle : clazz.runclass}
        className="list"
        onChange={handleChange}
      />
      <div>

        <button
          className="button-delete"
          onClick={() => handleDelete(clazz.id)}
        >
          удалить

        </button>

      </div>

    </div>

  );
}