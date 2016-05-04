module.exports = function (target, close, modal) {
  target.addEventListener('click', () => {
    document.body.classList.add('c-modal--open');
    console.log(`${modal} was opened`);
  });

  close.addEventListener('click', () => {
    document.body.classList.remove('c-modal--open');
    console.log(`${modal} was closed`);
  });
};
