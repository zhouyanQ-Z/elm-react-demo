import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import { connect } from 'react-redux'
import Toolbar from '@/components/toolbar';
import showdown from 'showdown'

function QuestionDetail(props) {

  let question = useMemo(() => {
    return props.question
  },[props.question])

  let markdownText = useMemo(() => {
     //转换markDown格式
     let converter = new showdown.Converter(); 
     return converter.makeHtml(question.detail);  
  },[question.detail])
  
  return (
    <div className="children-container detail-box question-detail">
      <Toolbar title={question.title} goBack={true} />

      <div id="scroll_div" className="scroll_container">
        <div dangerouslySetInnerHTML={{__html: markdownText}} className="markdown"></div>
      </div>
    </div>
  )
}

export default connect(
  state => ({question: state.profile.question}),
)(QuestionDetail);