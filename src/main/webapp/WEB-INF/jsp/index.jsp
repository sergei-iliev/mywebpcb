<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Bitslib</title>
</head>
<link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">         
<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.7.0/css/all.css' integrity='sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ' crossorigin='anonymous'>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="../bootstrap/js/bootstrap.min.js"></script> 
<body>
<div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 class="my-0 mr-md-auto font-weight-normal">Bitslib</h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <a class="p-2 text-dark" href="#">Slaves</a>
        <a class="p-2 text-dark" href="#">Freedom</a>
      </nav>
      <a class="btn btn-outline-primary" href="/logout">Sign up</a>
</div>
<div class="container">
<div class="panel panel-default">
   <div class="panel-body">
      <div class="row">
       <div class="col-lg-12 d-flex align-items-center justify-content-center">
       <div class="jumbotron">
  			<h1 class="display-4">Create Design Innovate</h1>
  			<p class="lead">Free and open-source schematic capture and pcb design online tool.</p>
  			<hr class="my-4">
  			<p>Deploy in your own premises for maximum security</p>  			
		</div>
		</div>
      </div>
      <div class="row">
        <div class="col-lg-3 d-flex align-items-center justify-content-center">
          <div class=" mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="media-middle">
               <a href="apps/symbols.html" >
                <img src="../img/symbol_icon.png">
               </a>
             </div>
            <h3>Symbol</h3>
            <p>Create,Edit and Share symbols</p>
          </div>
        </div>        
        <div class="col-lg-3 d-flex align-items-center justify-content-center">
          <div class=" mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="media-middle">
               <a href="apps/pads.html" >
                <img src="../img/footprint_icon.png">
               </a>
             </div>
            <h3>Footprint</h3>
            <p>Create,Edit and Share Footprint</p>
          </div>
        </div>
        <div class="col-lg-3 d-flex align-items-center justify-content-center">
          <div class=" mx-auto mb-0 mb-lg-3">
            <div class="media-middle">
               <a href="#" >
                <img src="../img/circuit_icon.png">
               </a>
             </div>
            <h3>Circuit</h3>
            <p>Create,Edit and Share Circuit</p>
          </div>
        </div>
        <div class="col-lg-3 d-flex align-items-center justify-content-center">
          <div class=" mx-auto mb-0 mb-lg-3">
            <div class="media-middle">
               <a href="apps/board.html" >
                <img src="../img/board_icon.png">
               </a>
             </div>            
            <h3>Board</h3>
            <p>Create, Edit and Share Boards</p>
          </div>
        </div>        
      </div>
      </div>
 </div>
</div>
<footer class="footer" style="background-color:#f5f5f5;margin-top:300px;">
<div class="container">
      <div class="row">
       <div class="col-lg-3">
       </div>
       <div class="col-lg-6 text-center">
           <span>myNetPCB is free, open source and always will be.</span>
       </div>
       <div class="col-lg-3">

       </div>       
      </div>
</div>
<div class="footer-copyright text-center">
<p class="text-muted">&copy; 2019 Copyright: Zelenite Eood</p></div>
</footer>
</body>
</html>