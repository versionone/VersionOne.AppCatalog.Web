# VersionOne Application Catalog

The following sequence diagram illustrates the code deployment pipeline.

<div class=wsd wsd_style="qsd">
<pre>
title App Catalog Code Deployment Pipeline

Developer->Developing Branch: Push Code
Developing Branch->+Jenkins: Build
Jenkins->-Jenkins: Test

Developer->Developing Branch: Merge to Staging
Developing Branch->Staging Branch: Merge
Staging Branch->Azure Staging: Deploy

Developer->Staging Branch: Merge to Production
Staging Branch->Master Branch: Merge
Master Branch->Azure Production: Deploy
</pre>
</div>

The following sequence diagram illustrates the data deployment pipeline.

<div class=wsd wsd_style="qsd">
<pre>
title App Catalog Data Deployment Pipeline

Publisher->Azure Staging: Push Data
Administrator->Azure Staging: Review Data
Administrator->Script: Publish Data
Script->Azure Staging: Copy to Prod
Azure Staging -> Azure Production: Push Data
</pre>
</div>

<script type="text/javascript" src="http://www.websequencediagrams.com/service.js"></script>