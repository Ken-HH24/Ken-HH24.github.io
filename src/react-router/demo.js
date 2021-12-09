import React from 'react';
import Link from './Link';
import Route from './Route';
import Switch from './Switch';
import withRouter from './HOC/withRouter';
import BrowserRouter from './BrowserRouter';

function B() {
    return <div>B Component</div>
}

class C extends React.Component {
    switchToB() {
        const { history } = this.props;
        history.push('/bbb');
    }

    render() {
        return (
            <div>
                <p>ccc</p>
                <button onClick={this.switchToB.bind(this)}>switch to B</button>
            </div>
        )
    }
}

const CwithRouter = withRouter(C);

const RouterDemo = () => {
    return (
        <div>
            <BrowserRouter>
                <ul>
                    <li><Link to='/aaa'>to aaa</Link></li>
                    <li><Link to='/bbb'>to bbb</Link></li>
                    <li><Link to='/ccc'>to ccc</Link></li>
                </ul>
                <Switch>
                    <Route path='/aaa' render={() => <p>aaa</p>}></Route>
                    <Route path='/bbb'><B /></Route>
                    <Route path='/ccc' component={CwithRouter}></Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default RouterDemo;