export default function selectFactory(dispatch, mapStateToProps, mapDispatchToProps) {
    let state;
    let ownProps;
    let stateProps;
    let dispatchProps;
    let mergedProps;

    function handleCall(firstState, firstOwnProps) {
        state = firstState;
        ownProps = firstOwnProps;
        stateProps = mapStateToProps(state, ownProps);
        dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = { ...ownProps, ...stateProps, ...dispatchProps };
        return mergedProps;
    }

    return function FinalPropsSelector(nextState, nextProps) {
        return handleCall(nextState, nextProps);
    }
}