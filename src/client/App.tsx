import * as React from 'react';
import { render } from 'react-dom';
import { HelloResponse } from 'src/shared/HelloResponse';

const App: React.FC = () => {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then((result: HelloResponse) => {
        setText(result.text);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  return <div>{text} from React</div>;
};

render(<App />, document.getElementById('root'));
