module.exports = function (x, y) {
  const field = {
    input: x,
    label: y
  };

  let z = 5;

  x.addEventListener('focusout', () => {
    if (field.input.value !== '') {
      z = 0;
    }
    field.label.style.zIndex = z;
  });

  x.addEventListener('focusin', () => {
    z = 5;
    field.label.style.zIndex = z;
  });
};
