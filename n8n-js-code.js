// ---------- Code 节点：Run Once (All Items) ----------

const output = [];

const inputItems = $input.all();   // 先拿一遍，后面需要索引

// 用对象映射优化 formType 到 templateIds 的判断
const templateIdMap = {
    // Complaint/Damages Form（起诉/损害赔偿表单）
    complaint: [
        // Complaint/Damages Form
        '148a187c0b746715400b503dd19dfe71df525267de463a487c9bc505be0cad71',
        'abd3a284f8d122ac4c233aeebdb4462f570792e21477dffad283ecabca1e2e49',
    ],
    // Answer Form（答辩表单，对应 Meet and Confer Letter RE Answer）
    answer: [
        // Meet and Confer Letter RE Answer
        '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
    ],
    // Settlement Agreement (Payments) Form（和解协议/付款安排表单）
    settlement: [
        // Settlement Agreement (Payments)
        '253036470b30a42e5d587370279f9fb9780066366bc0a8bc7c248d6f87801e1d',
    ],
    // Demurrer Motion Form（抗辩动议表单）
    demurrer: [
        // Demurrer Motion
        '10cb4c4629c9c347a73ec78a36d64c946d7dadb295049d15c202fac7922bcbd2',
        '8a84c243aa273569f0180cb12e6b71b3da276d320180b77b8d530baba3bf323c',
        '81717929a11601a416e3bee6555416dd3466efbf42f1d9057d7589acaa178381',
    ],
    // Motion to Strike Form（删除动议表单）
    motionToStrike: [
        // Motion to Strike
        '4d4d10421832659570693e817b25de8ab77c9bd517eb91eefe80a6aef7859996',
        '93040126ac5dfec6eb945f6c2d0868b2126385484275e4847214445305954a29',
        'ed39be88926edd996a4e112aec67d5fe0ee51240d7c7f0b73815ba61eacf3b31',
    ],
    // Request for Production Form（证据调取请求表单）
    requestForProduction: [
        // Request for Production
        'b369013328ce427559638bd24f5c932a65ea008a7aa148b3347b7bac7a9c4017',
    ],
    // PMP Depo Form（PMP 证词表单）
    pmpDepo: [
        // PMP Deposition
        '377d576604b7d807b8ec760621cfcd07ec5ca155754bfbc59feca1a3244df647',
    ],
    // NTC of Depo Form（开庭通知表单）
    ntcOfDepo: [
        // Notice of Deposition
        'c57494e428d7993f893022cfe0592a992af77a833b096a3796809821459572c4',
    ],
    // RFP Sexual Harassment Form（性骚扰案件证据调取表单）
    rfpSexualHarassment: [
        // RFP Sexual Harassment
        'd6ab81f88d6158492ebfcb721ed19cffdcbcdf1e94eb13e07a9eeb92316ceea5',
    ],
    // NTC of Ruling Form（裁决通知表单）
    ntcOfRuling: [
        // Notice of Ruling
        'd2a3b90ae65dd978c692712a89907ac5e8d02bd44c6a6fcf074d40017b571a5a',
    ],
    // CMC Notice Form（案件管理会议通知表单）
    cmcNotice: [
        // CMC Notice
        '22df26ddb07729500d530f8e22efc4026b515c2a8c77c22ec1608a3319d61903',
    ],
    // NTC Case Reassignment Form（案件重新分配通知表单）
    ntcCaseReassignment: [
        // NTC Case Reassignment
        '84e7781f81460320abb44c75a6e3f179ff8859f1a8cae2f6999ea92e4371e57f',
    ],
    // Special Interrogatories RE Overtime (SROGS01 Overtime 表单)
    srogs01Overtime: [
        // Special Interrogatories RE Overtime
        '7ded1637a1c0b49e45bd1c4d47de2db275de0ea3bd5dd1054242c87b8881fa63',
    ],
    // Declaration to Continue OSC (DECL CONTC OSC 表单)
    declContcOsc: [
        // Declaration to Continue OSC
        '28147e964a4905861cf321f1ae527f7d68290625e6146f0302bf5bbe1e601b82',
    ],
    // Declaration to Continue CMC (DECL TO CONT CMC 表单)
    declToContCmc: [
        // Declaration to Continue CMC
        'e416ab8505263b5afc80de3df178439931d1b675d557cc4922c9e43b14b81091',
    ],
    // Notice of Continued Hearing (NTC OF CONTINUED HEARING 表单)
    ntcOfContHearing: [
        // Notice of Continued Hearing
        '27f08808079bdd96f58fed56779b6729357a2778d7599ec6cb16b81158a3a90b',
    ],
};

for (let idx = 0; idx < inputItems.length; idx++) {
    const item = inputItems[idx];
    const {formData, formType} = item.json.body;
    console.log("item.json", item.json.body)
    console.log("formData", formData)
    console.log("formType", formType)
    // ① 根据 formType 选择 templateIds
    const templateIds = templateIdMap[formType];
    if (!templateIds) {
        throw new Error(`未知的 formType: ${formType}`);
    }

    // ② 拆分成多条输出；每条附带 pairedItem
    for (const id of templateIds) {
        output.push({
            json: {
                ...item.json,     // 保留所有原字段
                templateId: id,   // 单个 id
            },
            pairedItem: {       // 告诉 n8n：它来自第 idx 条输入
                item: idx,
            },
        });
    }
}

return output;
