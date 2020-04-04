import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, changeName] = useState("");
  const [nameErr, changeNameErr] = useState("");
  const [amount, changeAmount] = useState(0);
  const [amountErr, changeAmountErr] = useState("");
  const [records, changeRecords] = useState([]);
  const [balance, changeBalance] = useState(0);
  const [income, changeIncome] = useState(0);
  const [expence, changeExpence] = useState(0);
  const [_id, change_Id] = useState("");

  useEffect(() => {
    const temp = async () => {
      await fetch("http://localhost:5000/")
        .then(res => {
          return res.json();
        })
        .then(data => {
          changeRecords(data);
          let incomeVal = 0,
            expenceVal = 0,
            balanceVal = 0;
          data.forEach(record => {
            if (record.amount > 0) {
              incomeVal += record.amount;
            } else {
              expenceVal += record.amount;
            }
            balanceVal += record.amount;
          });
          changeBalance(balanceVal);
          changeIncome(incomeVal);
          changeExpence(expenceVal);
        });
    };
    temp();
  }, []);

  const validate = fields => {
    let valid = true;
    fields.forEach(field => {
      if (field.name === "name") {
        if (field.value == "") {
          changeNameErr("不能为空。");
          valid = false;
        }
      } else {
        if (field.value == 0) {
          changeAmountErr("不能为零。");
          valid = false;
        } else if (isNaN(field.value)) {
          changeAmountErr("必须输入数字。");
          valid = false;
        }
      }
    });

    return valid;
  };

  const formSubmit = async e => {
    const fields = [
      { name: "name", value: name },
      { name: "amount", value: amount }
    ];
    e.preventDefault();

    if (!validate(fields)) return;

    if(_id){
      await fetch("http://localhost:5000/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, amount, _id })
      }).then(() => {
        window.location.reload(false);
      });
    }else{
      await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, amount })
      }).then(() => {
        window.location.reload(false);
      });
    }
  };
  const edit = record => {
    changeName(record.name);
    changeAmount(record.amount);
    change_Id(record._id)
  };

  const remove = async record => {
    await fetch('http://localhost:5000/',{
      method: 'DELETE',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(record)
      
    }).then(()=>{
      window.location.reload(false)
    })
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">记账软件</h1>
        <div className="balance">
          余额：<span>{balance}￥</span>
        </div>
        <div className="section1">
          <div className="income">
            <h4>收入</h4>
            <div>{income}￥</div>
          </div>
          <div className="expence">
            <h4>支出</h4>
            <div>{expence}￥</div>
          </div>
        </div>
        <div className="history">
          <h2>记录</h2>
          <div className="list">
              {!!records && records.map(record=>{
                return(
                  <div
                  key={record._id}
                  className={
                    (record.amount > 0 ? "income" : "expence") + "-detail"
                  }
                >
                  <div className="wrap">
                    <span className="detail-name">{record.name}</span>
                    <div className="detail-amount">{record.amount}￥</div>
                  </div>
                  <div className="operation">
                    <div className="btn-wrap">
                      <button type="button" onClick={()=>edit(record)}>
                        编辑
                      </button>
                      <button type="button" onClick={()=>remove(record)}>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
                )
              })}
          </div>
        </div>
        <form onSubmit={formSubmit} id="form">
          <h2>添加记录</h2>
          <div className="form-group">
            <label htmlFor="name">名称</label>
            <input
              name="name"
              type="text"
              placeholder="请输入名称"
              value={name}
              onChange={e => {
                changeName(e.target.value);
                changeNameErr("");
              }}
            />
            {nameErr ? <span className="error">{nameErr}</span> : ""}
          </div>
          <div className="form-group">
            <label htmlFor="amount">金额</label>
            <input
              name="amount"
              type="text"
              placeholder="请输入金额"
              value={amount}
              onChange={e => {
                changeAmount(e.target.value);
                changeAmountErr("");
              }}
            />
            {amountErr ? <span className="error">{amountErr}</span> : ""}
            <span>*正数为收入，负数为支出。</span>
          </div>
          <div className="form-group form-btn">
            <button type="submit">提交</button>
            <button type="button">取消</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
