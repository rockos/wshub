    <table>
        <thead>
            <tr>
                <td></td>
                <td>エラー日時</td>
                <td>コード</td>
                <td>エラー内容</td>
                <td>確認</td>
                <td>確認内容</td>
                <td>確認者</td>
            </tr>
        </thead>
        <tbody>
           {{#recode}}
            <tr>
                <td><input type="radio" name="resultError" value="{{id}}" 
                    onclick="resultErrorClicked({confirmComment:'{{confirmComment}}', confirmUser:'{{confirmUser}}'});"></td>
                <td>{{fmtdate}}</td>
                <td>{{code}}</td>
                <td>{{errorText}}</td>
                <td>{{decodeConfirm}}</td>
                <td>{{confirmComment}}</td>
                <td>{{confirmUser}}</td>
            </tr>
           {{/recode}}
        </tbody>
    </table>
