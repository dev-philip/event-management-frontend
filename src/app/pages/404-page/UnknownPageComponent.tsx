import React, { useState } from 'react';
import Modal from '@/app/components/modal/ModalComponent';
import { increment, decrement, incrementByAmount } from '@/app/features/counter/counterSlice';
import { useDispatch, useSelector } from 'react-redux';

const UnknownPageComponent: React.FC = () => {
  const count = useSelector((state:any) => state.counter.value);
  const dispatch = useDispatch();

  //For modal
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
        <div>Hello World</div>
        <div>
          <h1>Home Page</h1>
          <button onClick={() => setModalOpen(true)}>Open Modal</button>

          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <h2>This is a Modal</h2>
            <p>You can put anything here.</p>
          </Modal>
        </div>

         <div>
        <h2>Count: {count}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      </div>
    </>
   
  );
};

export default UnknownPageComponent;
