module.exports = function (context, data) {
    if ( !data || !data.pull_request ){
       context.done("not a pull reqeust");
    }
    else {
    
        var parsedData = parse(data);
        var gitstatus = { "url": parsedData.url, "status":"pending"};
        context.res = { status:200, body: "done with this..."};
        context.bindings.queueout = gitstatus;
        context.bindings.store = { "key": parsedData.prid.toString(), "type":"pullrequest", "body": parsedData };
        context.log(gitstatus);
        context.done();
    }
};

function parse(gitPullRequest){
    
    var root = gitPullRequest.pull_request;
    
    var rv = {
    prid: gitPullRequest.number,
    action: gitPullRequest.action,
    url: root.url,
    branch : root.base.ref,    
    sha: root.head.sha,
    statuses_url : root.statuses_url,
    head : {
      label : root.head.label,
      ref : root.head.ref,
      sha : root.head.sha,
      repo : root.head.repo.full_name,
      url : root.head.repo.clone_url
    },
    base : {
      label: root.base.label,
      ref : root.base.ref,
      sha : root.base.sha,
      repo : root.base.full_name,
      url : root.base.clone_url
    }
  }
  
  return rv;
}