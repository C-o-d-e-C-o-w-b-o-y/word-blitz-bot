import robot from 'robotjs';

const delay = 200;

const getPos = () => {
  setTimeout(() => {
    console.log(robot.getMousePos());
    getPos();
  }, delay);
};

getPos(delay);
