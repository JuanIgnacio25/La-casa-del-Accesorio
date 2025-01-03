
function ConfirmOrderComments({handleCommentsChange , comments}) {

  return (
    <div className="confirm-order-comments">
      <h4>¿Necesitas algún ajuste en tu pedido?</h4>
      <textarea
        placeholder="podes dejar tus comentarios aca..."
        className="confirm-order-comments-text"
        value={comments}
        onChange={(e) => handleCommentsChange(e)}
      />
    </div>
  );
}

export default ConfirmOrderComments;
