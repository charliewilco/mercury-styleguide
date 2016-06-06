module.exports = function (target, close, modal) {
  target.addEventListener('click', (evt) => {
    evt.preventDefault();
    document.body.classList.add('c-modal--open');
    console.log(`${modal} was opened`);
  });

  close.addEventListener('click', (evt) => {
    evt.preventDefault();
    document.body.classList.remove('c-modal--open');
    console.log(`${modal} was closed`);
  });
};
